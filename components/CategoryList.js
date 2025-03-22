
export default function CategoryList() {
  const categories = [
    {
      name: 'Admin Tools',
      icon: '🛡️',
      description: 'Tools for server administration and moderation',
      count: 42
    },
    {
      name: 'Economy',
      icon: '💰',
      description: 'Currency, shops, and trading systems',
      count: 38
    },
    {
      name: 'Game Mechanics',
      icon: '⚙️',
      description: 'Modify or extend Minecraft\'s core gameplay',
      count: 56
    },
    {
      name: 'Anti-Griefing',
      icon: '🔒',
      description: 'Protect your server from griefers and hackers',
      count: 29
    },
    {
      name: 'Chat',
      icon: '💬',
      description: 'Chat formatting, channels, and moderation',
      count: 24
    },
    {
      name: 'Minigames',
      icon: '🎮',
      description: 'Fun games and activities for your server',
      count: 47
    },
    {
      name: 'World Management',
      icon: '🌍',
      description: 'World generation, editing, and management',
      count: 35
    },
    {
      name: 'Utility',
      icon: '🔧',
      description: 'Useful tools and utilities for your server',
      count: 62
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <a
          key={category.name}
          href={`/plugins?category=${encodeURIComponent(category.name)}`}
          className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="p-6">
            <div className="text-3xl mb-3">{category.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{category.description}</p>
            <div className="text-primary-600 font-medium text-sm">
              {category.count} plugins
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
