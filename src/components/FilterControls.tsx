'use client';

import React from 'react';
import { 
  ViewMode, 
  Priority, 
  TaskStatus, 
  SortOption, 
  Category 
} from '@/types/task';
import {
  List,
  LayoutGrid,
  Calendar,
  ArrowUpDown
} from 'lucide-react';

interface FilterControlsProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  selectedPriority: Priority | 'all';
  onPriorityChange: (p: Priority | 'all') => void;
  selectedStatus: TaskStatus | 'all';
  onStatusChange: (s: TaskStatus | 'all') => void;
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
  dueFilter: 'all' | 'today' | 'upcoming' | 'overdue';
  onDueFilterChange: (f: 'all' | 'today' | 'upcoming' | 'overdue') => void;
  sortBy: SortOption;
  onSortByChange: (s: SortOption) => void;
  categories: Category[];
  hideStatusFilter?: boolean;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  viewMode,
  onViewChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  dueFilter,
  onDueFilterChange,
  sortBy,
  onSortByChange,
  categories,
  hideStatusFilter = false,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '12px 32px',
        marginBottom: '20px',
        background: 'var(--bg-app)',
      }}
    >
      {/* View Switcher Tabs */}
      <div
        style={{
          display: 'flex',
          background: 'var(--bg-surface)',
          padding: '3px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)',
        }}
      >
        <button
          className="btn"
          style={{
            padding: '6px 12px',
            fontSize: '0.8rem',
            background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
            color: viewMode === 'list' ? '#ffffff' : 'var(--text-secondary)',
          }}
          onClick={() => onViewChange('list')}
        >
          <List size={14} />
          <span>List</span>
        </button>

        <button
          className="btn"
          style={{
            padding: '6px 12px',
            fontSize: '0.8rem',
            background: viewMode === 'kanban' ? 'var(--primary)' : 'transparent',
            color: viewMode === 'kanban' ? '#ffffff' : 'var(--text-secondary)',
          }}
          onClick={() => onViewChange('kanban')}
        >
          <LayoutGrid size={14} />
          <span>Board</span>
        </button>

        <button
          className="btn"
          style={{
            padding: '6px 12px',
            fontSize: '0.8rem',
            background: viewMode === 'calendar' ? 'var(--primary)' : 'transparent',
            color: viewMode === 'calendar' ? '#ffffff' : 'var(--text-secondary)',
          }}
          onClick={() => onViewChange('calendar')}
        >
          <Calendar size={14} />
          <span>Calendar</span>
        </button>
      </div>

      {/* Filter and Sort Dropdowns */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          style={{ fontSize: '0.8rem', padding: '6px 10px', height: '34px' }}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value as Priority | 'all')}
          style={{ fontSize: '0.8rem', padding: '6px 10px', height: '34px' }}
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Status Filter (if not Kanban) */}
        {!hideStatusFilter && viewMode !== 'kanban' && (
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'all')}
            style={{ fontSize: '0.8rem', padding: '6px 10px', height: '34px' }}
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        )}

        {/* Due Date Filter */}
        <select
          value={dueFilter}
          onChange={(e) => onDueFilterChange(e.target.value as 'all' | 'today' | 'upcoming' | 'overdue')}
          style={{ fontSize: '0.8rem', padding: '6px 10px', height: '34px' }}
        >
          <option value="all">All Dates</option>
          <option value="today">Due Today</option>
          <option value="upcoming">Upcoming (7 days)</option>
          <option value="overdue">Overdue</option>
        </select>

        {/* Sort By Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowUpDown size={14} color="var(--text-muted)" />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortOption)}
            style={{ fontSize: '0.8rem', padding: '6px 10px', height: '34px' }}
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="deadline">Sort: Deadline</option>
            <option value="priority">Sort: Priority</option>
          </select>
        </div>
      </div>
    </div>
  );
};
