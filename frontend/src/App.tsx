import { ChatProvider } from './context/ChatContext';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ChatArea from './components/Chat/ChatArea';
import InputArea from './components/Input/InputArea';

function AppLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <Header />

      {/* Body: Sidebar + Chat */}
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar />

        {/* Main chat column */}
        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          <ChatArea />
          <InputArea />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <AppLayout />
    </ChatProvider>
  );
}
