'use client';

import React, { useState } from 'react';
import { Category, Task } from '@/types/task';
import {
  Plus,
  Briefcase,
  GraduationCap,
  User,
  FolderGit2,
  ShoppingCart,
  Star,
  Heart,
  Bookmark,
  Check,
  Trash2,
  FolderTree
} from 'lucide-react';

interface CategoriesViewProps {
  categories: Category[];
  tasks: Task[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onDeleteCategory: (categoryId: string) => void;
  onFilterByCategory: (categoryName: string) => void;
}

const PRESET_COLORS = [
  '#4f46e5', // Indigo
  '#8b5cf6', // Violet
  '#0ea5e9', // Sky
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#06b6d4', // Cyan
];

const PRESET_ICONS = [
  { name: 'Briefcase', component: <Briefcase size={16} /> },
  { name: 'GraduationCap', component: <GraduationCap size={16} /> },
  { name: 'User', component: <User size={16} /> },
  { name: 'FolderGit2', component: <FolderGit2 size={16} /> },
  { name: 'ShoppingCart', component: <ShoppingCart size={16} /> },
  { name: 'Star', component: <Star size={16} /> },
  { name: 'Heart', component: <Heart size={16} /> },
  { name: 'Bookmark', component: <Bookmark size={16} /> },
];

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  tasks,
  onAddCategory,
  onDeleteCategory,
  onFilterByCategory,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState('Briefcase');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddCategory({
      name: name.trim(),
      color: selectedColor,
      icon: selectedIcon,
    });

    setName('');
    setIsAdding(false);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase size={18} />;
      case 'GraduationCap': return <GraduationCap size={18} />;
      case 'User': return <User size={18} />;
      case 'FolderGit2': return <FolderGit2 size={18} />;
      case 'ShoppingCart': return <ShoppingCart size={18} />;
      case 'Star': return <Star size={18} />;
      case 'Heart': return <Heart size={18} />;
      case 'Bookmark': return <Bookmark size={18} />;
      default: return <Briefcase size={18} />;
    }
  };

  return (
    <div style={{ padding: '0 32px 32px 32px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--primary-subtle)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FolderTree size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
              Custom Categories
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Compartmentalize your work, personal projects, university studies, and daily tasks.
            </p>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus size={16} />
          <span>New Category</span>
        </button>
      </div>

      {/* Inline Creation Card */}
      {isAdding && (
        <div
          className="card animate-pop"
          style={{
            padding: '20px 24px',
            marginBottom: '24px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-focus)',
          }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
            Create New Category
          </h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                Category Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Design System, Fitness, Side Project..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', maxWidth: '400px' }}
              />
            </div>

            {/* Color selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
                Select Color Theme
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: c,
                      border: selectedColor === c ? '2px solid #ffffff' : 'none',
                      boxShadow: selectedColor === c ? '0 0 0 2px var(--primary)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => setSelectedColor(c)}
                  >
                    {selectedColor === c && <Check size={14} color="#ffffff" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
                Select Icon
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {PRESET_ICONS.map((i) => (
                  <button
                    key={i.name}
                    type="button"
                    className="btn btn-secondary"
                    style={{
                      padding: '8px 12px',
                      background: selectedIcon === i.name ? 'var(--primary-subtle)' : 'var(--bg-subtle)',
                      borderColor: selectedIcon === i.name ? 'var(--border-focus)' : 'var(--border-color)',
                      color: selectedIcon === i.name ? 'var(--primary)' : 'var(--text-secondary)',
                    }}
                    onClick={() => setSelectedIcon(i.name)}
                  >
                    {i.component}
                    <span style={{ fontSize: '0.8rem', marginLeft: '6px' }}>{i.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button type="submit" className="btn btn-primary">
                Save Category
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Categories */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {categories.map((cat) => {
          const categoryTasks = tasks.filter((t) => t.category.toLowerCase() === cat.name.toLowerCase());
          const completedCount = categoryTasks.filter((t) => t.status === 'completed').length;
          const pendingCount = categoryTasks.length - completedCount;

          return (
            <div
              key={cat.id}
              className="category-card"
              style={{
                '--card-accent': cat.color,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              } as React.CSSProperties}
            >
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `color-mix(in srgb, ${cat.color}, transparent 82%)`,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {renderIcon(cat.icon)}
                  </div>

                  {categories.length > 1 && (
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '6px', color: 'var(--text-muted)' }}
                      title="Delete category"
                      onClick={() => onDeleteCategory(cat.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                  {cat.name}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  {categoryTasks.length} total tasks ({pendingCount} pending, {completedCount} completed)
                </p>
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Progress bar */}
                <div style={{ height: '6px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${categoryTasks.length > 0 ? (completedCount / categoryTasks.length) * 100 : 0}%`,
                      background: cat.color,
                      borderRadius: '999px',
                    }}
                  />
                </div>

                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                  onClick={() => onFilterByCategory(cat.name)}
                >
                  View Tasks in {cat.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
