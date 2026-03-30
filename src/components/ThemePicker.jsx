export default function ThemePicker({ themes, currentIndex, onSelect, isDark }) {
  return (
    <div className="flex items-center gap-2">
      {themes.map((theme, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          title={theme.name}
          className="relative w-6 h-6 rounded-full transition-all duration-200 active:scale-95"
          style={{ backgroundColor: theme.preview }}
        >
          {/* 選択中リング */}
          {currentIndex === i && (
            <span
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: `0 0 0 2px ${isDark ? '#1f2937' : '#f9fafb'}, 0 0 0 4px ${theme.preview}`,
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
