import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import { randomBytes } from "crypto";
import { storage } from "./storage";
import MemoryStore from "memorystore";
import { User } from "@shared/schema";

// Create a memory store for sessions
const MemoryStoreConstructor = MemoryStore(session);

// Session store configuration
const sessionStore = new MemoryStoreConstructor({
  checkPeriod: 86400000, // prune expired entries every 24h
});

// Passport user serialization
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user || undefined);
  } catch (err) {
    done(err);
  }
});

// Mock strategy to simulate federated auth for demonstration
passport.use(
  new LocalStrategy(
    {
      usernameField: "provider",
      passwordField: "provider", 
      passReqToCallback: true,
    },
    async (req, provider, _, done) => {
      try {
        // In a real app, we would validate the credentials with the identity provider
        // Here we're just creating a mock user for demonstration
        
        // Check if a user with this provider/email combination exists
        const email = "demo@example.com";
        let existingUser = await storage.getUserByProviderAndEmail(provider, email);
        
        if (existingUser) {
          // Update the user's session info
          await storage.updateUserSession(existingUser.id);
          
          // Log the login activity
          await storage.createActivityLog({
            userId: existingUser.id,
            type: "login",
            description: "Successful login",
            userAgent: req.headers["user-agent"] || "",
            ipAddress: req.ip || "",
          });
          
          return done(null, existingUser);
        }
        
        // Create a new user for this demo
        const newUser = await storage.createUser({
          username: `user_${randomBytes(4).toString("hex")}`,
          password: randomBytes(16).toString("hex"), // Random password for demo
          name: "Demo User",
          email: email,
          provider: provider,
          providerId: `${provider}_id_${randomBytes(8).toString("hex")}`,
          accessToken: `mock_access_token_${randomBytes(8).toString("hex")}`,
          refreshToken: `mock_refresh_token_${randomBytes(8).toString("hex")}`,
          tokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
          scopes: "profile email read:data",
          metadata: {
            isDemo: true,
            connectedApps: 1,
            browser: req.headers["user-agent"] ? "Browser" : "Unknown",
            os: "Operating System",
          },
        });
        
        // Log the new user creation and login
        await storage.createActivityLog({
          userId: newUser.id,
          type: "login",
          description: "Account created and first login",
          userAgent: req.headers["user-agent"] || "",
          ipAddress: req.ip || "",
        });
        
        done(null, newUser);
      } catch (err) {
        done(err);
      }
    }
  )
);

// Configure express session and passport
export function setupAuth(app: express.Express) {
  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dev-secret-key",
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Auth middleware to check if the user is authenticated
  app.use((req, res, next) => {
    // Add the user to res.locals for use in templates if needed
    res.locals.user = req.user || null;
    next();
  });
}

// Middleware to require authentication
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

// Function to transform the database user object into a client-safe user object
export function transformUser(user: User | undefined) {
  if (!user) return null;
  
  const metadata = user.metadata as any || {};
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: null, // We don't store avatars in this demo
    provider: user.provider || "federated",
    scopes: user.scopes || "profile, email, read:data",
    sessionExpires: user.tokenExpiry ? `In ${Math.floor((new Date(user.tokenExpiry).getTime() - Date.now()) / 60000)} minutes` : "In 59 minutes",
    connectedApps: metadata.connectedApps || 1,
    browser: metadata.browser || "Browser",
    os: metadata.os || "Operating System",
    // We'd typically load activities from a separate table in a real app
    activities: [],
  };
}
