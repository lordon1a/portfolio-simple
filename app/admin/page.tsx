"use client"

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, LogOut } from 'lucide-react'

type ContentType = 'projects' | 'experience' | 'education' | 'skills' | 'achievements'

interface BaseItem {
  id: string
  [key: string]: any
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<ContentType>('projects')
  const [items, setItems] = useState<BaseItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingItem, setEditingItem] = useState<BaseItem | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const tabs: { id: ContentType; label: string }[] = [
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'achievements', label: 'Achievements' },
  ]

  useEffect(() => {
    fetchItems()
  }, [activeTab])

  const fetchItems = async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const response = await fetch(`/api/${activeTab}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${activeTab}`)
      }
      const data = await response.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch items:', error)
      setItems([])
      setErrorMessage(`Could not load ${activeTab}. Please refresh and try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (item: BaseItem) => {
    setIsSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      const response = await fetch(`/api/${activeTab}`, {
        method: isAdding ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })

      const result = await response.json().catch(() => null)

      if (response.ok) {
        await fetchItems()
        setEditingItem(null)
        setIsAdding(false)
        setSuccessMessage(isAdding ? 'Item added successfully.' : 'Item updated successfully.')
      } else {
        setErrorMessage(result?.error || 'Failed to save item.')
      }
    } catch (error) {
      console.error('Failed to save item:', error)
      setErrorMessage('Failed to save item. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      const response = await fetch(`/api/${activeTab}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      const result = await response.json().catch(() => null)

      if (response.ok) {
        await fetchItems()
        setSuccessMessage('Item deleted successfully.')
      } else {
        setErrorMessage(result?.error || 'Failed to delete item.')
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
      setErrorMessage('Failed to delete item. Please try again.')
    }
  }

  const handleAddNew = () => {
    const newItem: BaseItem = {
      id: Date.now().toString(),
    }

    // Add default fields based on content type
    switch (activeTab) {
      case 'projects':
        Object.assign(newItem, {
          title: '',
          year: new Date().getFullYear().toString(),
          stars: 0,
          description: '',
          tags: [],
          github: '',
        })
        break
      case 'experience':
        Object.assign(newItem, {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
          technologies: [],
        })
        break
      case 'education':
        Object.assign(newItem, {
          school: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          description: '',
        })
        break
      case 'skills':
        Object.assign(newItem, {
          category: '',
          name: '',
          level: '',
        })
        break
      case 'achievements':
        Object.assign(newItem, {
          title: '',
          date: '',
          description: '',
          organization: '',
        })
        break
    }

    setEditingItem(newItem)
    setIsAdding(true)
  }

  const handleLogout = async () => {
    window.location.href = '/api/auth/signout'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 bg-amber-500 text-gray-900 px-4 py-2 rounded hover:bg-amber-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-700 text-gray-300 px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-700">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setEditingItem(null)
                  setIsAdding(false)
                  setErrorMessage(null)
                  setSuccessMessage(null)
                }}
                className={`pb-3 px-2 transition-all ${
                  activeTab === tab.id
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {(editingItem || isAdding) && (
          <DynamicForm
            item={editingItem!}
            contentType={activeTab}
            isAdding={isAdding}
            isSaving={isSaving}
            onSave={handleSave}
            onCancel={() => {
              setEditingItem(null)
              setIsAdding(false)
            }}
          />
        )}

        {errorMessage && (
          <div className="mb-6 rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              contentType={activeTab}
              onEdit={() => setEditingItem(item)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>

        {items.length === 0 && !editingItem && (
          <div className="text-center py-12">
            <p className="text-gray-400">No items yet. Click "Add New" to create one.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ItemCard({
  item,
  contentType,
  onEdit,
  onDelete,
}: {
  item: BaseItem
  contentType: ContentType
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="bg-secondary p-4 rounded-lg border border-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100 mb-2">
            {item.title || item.company || item.school || item.name || 'Untitled'}
          </h3>
          <div className="text-sm text-gray-400 space-y-1">
            {Object.entries(item)
              .filter(([key]) => key !== 'id')
              .map(([key, value]) => (
                <div key={key}>
                  <span className="text-gray-500">{key}:</span>{' '}
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </div>
              ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-amber-400 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function DynamicForm({
  item,
  contentType,
  isAdding,
  isSaving,
  onSave,
  onCancel,
}: {
  item: BaseItem
  contentType: ContentType
  isAdding: boolean
  isSaving: boolean
  onSave: (item: BaseItem) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(item)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const updateField = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-secondary p-6 rounded-lg border border-gray-800 mb-6"
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        {isAdding ? 'Add New Item' : 'Edit Item'}
      </h2>

      <div className="space-y-4">
        {Object.entries(formData)
          .filter(([key]) => key !== 'id')
          .map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm text-gray-400 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {Array.isArray(value) ? (
                <input
                  type="text"
                  value={value.join(', ')}
                  onChange={(e) =>
                    updateField(
                      key,
                      e.target.value.split(',').map((t) => t.trim())
                    )
                  }
                  className="w-full bg-gray-800 text-gray-100 px-3 py-2 rounded border border-gray-700 focus:border-amber-500 outline-none"
                  placeholder="Comma separated values"
                />
              ) : typeof value === 'number' ? (
                <input
                  type="number"
                  value={value}
                  onChange={(e) => {
                    const nextValue = Number(e.target.value)
                    updateField(key, Number.isNaN(nextValue) ? 0 : nextValue)
                  }}
                  className="w-full bg-gray-800 text-gray-100 px-3 py-2 rounded border border-gray-700 focus:border-amber-500 outline-none"
                />
              ) : key.toLowerCase().includes('description') ? (
                <textarea
                  value={value}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="w-full bg-gray-800 text-gray-100 px-3 py-2 rounded border border-gray-700 focus:border-amber-500 outline-none"
                  rows={3}
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="w-full bg-gray-800 text-gray-100 px-3 py-2 rounded border border-gray-700 focus:border-amber-500 outline-none"
                />
              )}
            </div>
          ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 bg-amber-500 text-gray-900 px-4 py-2 rounded hover:bg-amber-400 transition-colors"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="flex items-center gap-2 bg-gray-700 text-gray-300 px-4 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </form>
  )
}
