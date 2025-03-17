/**
 * Icon utility file for easy access to Lucide icons
 * 
 * This file re-exports commonly used icons from lucide-react
 * Add more icons as needed for your project
 */

// Import and export commonly used icons
export {
  // UI and Navigation
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Search,
  Settings,
  Home,
  
  // Actions
  Plus,
  Minus,
  Edit,
  Trash,
  Copy,
  Save,
  Download,
  Upload,
  
  // Communication
  Mail,
  MessageSquare,
  Send,
  Phone,
  
  // Status and Feedback
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  
  // Media
  Image,
  Video,
  Music,
  Play,
  Pause,
  
  // Files and Data
  File,
  Folder,
  Database,
  
  // Users
  User,
  Users,
  UserPlus,
  
  // Misc
  Calendar,
  Clock,
  Star,
  Heart,
  
  // API related
  Code,
  Terminal,
  Webhook,
  Cpu,
} from 'lucide-react';

// Export the LucideProps type
export type { LucideProps } from 'lucide-react';

/**
 * Example usage:
 * 
 * import { Search, User } from '@/lib/icons';
 * 
 * function MyComponent() {
 *   return (
 *     <div>
 *       <Search className="w-5 h-5" />
 *       <User className="w-5 h-5" />
 *     </div>
 *   );
 * }
 */ 