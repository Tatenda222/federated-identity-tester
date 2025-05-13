import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "passport";
import { setupAuth, requireAuth, transformUser } from "./auth";
import { randomBytes } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Authentication Routes
  app.post("/api/auth/login", (req, res, next) => {
    const { provider } = req.body;
    
    // In a real app, we would redirect to the identity provider here
    // For this demo app, we'll authenticate the user locally
    
    passport.authenticate("local", (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ error: "Authentication failed" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ error: "Login error" });
        }
        
        const returnUser = transformUser(user);
        
        // Return the user data and a mock token
        return res.json({
          user: returnUser,
          token: `mock_jwt_token_${randomBytes(16).toString("hex")}`,
        });
      });
    })(req, res, next);
  });
  
  // OAuth callback handler - in a real app this would process the code from the identity provider
  app.post("/api/auth/callback", (req, res) => {
    const { provider, token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }
    
    // In a real app, we would validate the JWT token here
    // For this demo, we'll authenticate the user locally
    
    passport.authenticate("local", { token }, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ error: "Authentication failed" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ error: "Login error" });
        }
        
        const returnUser = transformUser(user);
        
        // Return the user data and a mock token
        return res.json({
          user: returnUser,
          token: `mock_jwt_token_${randomBytes(16).toString("hex")}`,
        });
      });
    })(req, res);
  });

  // Get the current user
  app.get("/api/auth/me", requireAuth, (req, res) => {
    // Return the transformed user data
    const user = transformUser(req.user as any);
    res.json(user);
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    // Record logout activity if user is authenticated
    if (req.isAuthenticated() && req.user) {
      const userId = (req.user as any).id;
      
      storage.createActivityLog({
        userId,
        type: "logout",
        description: "User logged out",
        userAgent: req.headers["user-agent"] || "",
        ipAddress: req.ip || "",
      }).catch(err => {
        console.error("Failed to log logout activity:", err);
      });
    }
    
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Protected route example
  app.get("/api/protected", requireAuth, (req, res) => {
    res.json({
      message: "This is protected data accessible only to authenticated users",
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
