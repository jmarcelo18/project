import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { AppProvider } from './context/AppContext';
import Login from './pages/Login';
import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={session ? <Layout /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;