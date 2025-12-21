import PropertyDashboard from './components/PropertyDashboard';
import { SnackbarProvider } from './components/Snackbar';

function App() {
  return (
    <SnackbarProvider>
      <PropertyDashboard />
    </SnackbarProvider>
  );
}

export default App;
