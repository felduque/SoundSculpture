import { Moon, Sun } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { TouchableOpacity } from 'react-native';
export function ThemeToggle() {
  const {colorScheme, setColorScheme} = useColorScheme()

  const toggleTheme = () => {

    // Cambiar entre 'light', 'dark' o 'system' según el estado actual
    if (colorScheme === 'light') {
      setColorScheme('dark');
    } else {
      setColorScheme('light');
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full"
      accessibilityLabel={colorScheme === "dark" ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      accessibilityRole="button"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {colorScheme === "light" ? (
        <Sun size={24} color="#fbbf24" />
      ) : (
        <Moon size={24} color="#1e40af" />
      )}
    </TouchableOpacity>
  );
}
