import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';

// Generic hook to fetch a single document by ID
export const useDocument = <T = DocumentData>(
  collectionName: string, 
  docId: string | null | undefined
) => {
  const [document, setDocument] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!docId) {
      setDocument(null);
      return;
    }

    const fetchDocument = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setDocument({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setDocument(null);
          setError(`No document found with ID: ${docId}`);
        }
      } catch (err) {
        console.error(`Error fetching ${collectionName} document:`, err);
        setError(`Failed to fetch document: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [collectionName, docId]);

  return { document, error, loading };
};

// Hook to fetch user data
export const useUserData = () => {
  const { user } = useAuth();
  const userId = user?.id;
  
  return useDocument('users', userId || null);
};

// Helper function to convert a single document
const convertDocument = <T = DocumentData>(doc: QueryDocumentSnapshot<DocumentData>): T => {
  return { id: doc.id, ...doc.data() } as T;
};

// Helper function to convert a collection of documents
const convertCollection = <T = DocumentData>(snapshot: QuerySnapshot<DocumentData>): T[] => {
  return snapshot.docs.map(doc => convertDocument<T>(doc));
};

// Hook to query a collection
export const useQuery = <T = DocumentData>(
  collectionName: string,
  queryFn?: (ref: any) => any
) => {
  const [documents, setDocuments] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      try {
        const collectionRef = collection(db, collectionName);
        const q = queryFn ? queryFn(collectionRef) : collectionRef;
        const snapshot = await getDocs(q);
        
        const data = convertCollection<T>(snapshot);
        setDocuments(data);
      } catch (err) {
        console.error(`Error fetching ${collectionName} collection:`, err);
        setError(`Failed to fetch collection: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [collectionName, queryFn]);

  return { documents, error, loading };
};

// Hook to get current user's application connections
export const useUserConnections = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery('connections', (ref: any) => 
    userId ? query(ref, where('userId', '==', userId)) : null
  );
};