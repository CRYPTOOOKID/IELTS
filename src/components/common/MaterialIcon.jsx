import React from 'react';
import { 
  ArrowBack,
  School,
  RecordVoiceOver,
  Headphones,
  MenuBook,
  Edit,
  CheckCircle,
  Cancel,
  Home,
  Person,
  Settings,
  Logout,
  PlayArrow,
  Pause,
  Stop,
  VolumeUp,
  VolumeOff,
  SkipNext,
  SkipPrevious,
  Replay,
  Forward10,
  Replay10,
  ExpandMore,
  ExpandLess,
  KeyboardArrowDown,
  KeyboardArrowUp,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Close,
  Menu,
  MoreVert,
  Info,
  Warning,
  Error,
  Success,
  Star,
  StarBorder,
  Favorite,
  FavoriteBorder,
  Share,
  Download,
  Upload,
  Search,
  FilterList,
  Sort,
  ViewList,
  ViewModule,
  GridView,
  Refresh,
  Sync,
  SyncProblem,
  Wifi,
  WifiOff,
  Signal,
  Battery,
  Brightness,
  Volume,
  Notifications,
  NotificationsOff,
  SportsEsports,
  ArrowForward,
  Bolt,
  Language,
  WorkspacePremium,
  EditNote,
  SportsGamepad,
  Quiz,
  Work
} from '@mui/icons-material';

// Map of Material Icon names to Material-UI components
const iconMap = {
  'arrow_back': ArrowBack,
  'school': School,
  'record_voice_over': RecordVoiceOver,
  'headphones': Headphones,
  'menu_book': MenuBook,
  'edit': Edit,
  'check_circle': CheckCircle,
  'cancel': Cancel,
  'home': Home,
  'person': Person,
  'settings': Settings,
  'logout': Logout,
  'play_arrow': PlayArrow,
  'pause': Pause,
  'stop': Stop,
  'volume_up': VolumeUp,
  'volume_off': VolumeOff,
  'skip_next': SkipNext,
  'skip_previous': SkipPrevious,
  'replay': Replay,
  'forward_10': Forward10,
  'replay_10': Replay10,
  'expand_more': ExpandMore,
  'expand_less': ExpandLess,
  'keyboard_arrow_down': KeyboardArrowDown,
  'keyboard_arrow_up': KeyboardArrowUp,
  'keyboard_arrow_left': KeyboardArrowLeft,
  'keyboard_arrow_right': KeyboardArrowRight,
  'close': Close,
  'menu': Menu,
  'more_vert': MoreVert,
  'info': Info,
  'warning': Warning,
  'error': Error,
  'success': Success,
  'star': Star,
  'star_border': StarBorder,
  'favorite': Favorite,
  'favorite_border': FavoriteBorder,
  'share': Share,
  'download': Download,
  'upload': Upload,
  'search': Search,
  'filter_list': FilterList,
  'sort': Sort,
  'view_list': ViewList,
  'view_module': ViewModule,
  'grid_view': GridView,
  'refresh': Refresh,
  'sync': Sync,
  'sync_problem': SyncProblem,
  'wifi': Wifi,
  'wifi_off': WifiOff,
  'signal': Signal,
  'battery': Battery,
  'brightness': Brightness,
  'volume': Volume,
  'notifications': Notifications,
  'notifications_off': NotificationsOff,
  'sports_esports': SportsEsports,
  'arrow_forward': ArrowForward,
  'bolt': Bolt,
  'language': Language,
  'workspace_premium': WorkspacePremium,
  'edit_note': EditNote,
  'gamepad': SportsGamepad,
  'quiz': Quiz,
  'work': Work
};

/**
 * MaterialIcon component that renders Material-UI icons instead of font icons
 * @param {string} name - The Material Icon name (e.g., 'arrow_back', 'school')
 * @param {string} className - Additional CSS classes
 * @param {object} style - Inline styles
 * @param {string} fontSize - Icon size: 'small', 'medium', 'large', or custom
 */
const MaterialIcon = ({ 
  name, 
  className = '', 
  style = {}, 
  fontSize = 'medium',
  ...props 
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`MaterialIcon: Icon "${name}" not found. Available icons:`, Object.keys(iconMap));
    return <span className={className} style={style} {...props}>{name}</span>;
  }
  
  return (
    <IconComponent 
      className={className}
      style={style}
      fontSize={fontSize}
      {...props}
    />
  );
};

export default MaterialIcon; 