'use client';

import React, { useEffect } from 'react';
import { useCategory } from '@/hooks/useCategory';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import CategoryHeader from '@/components/admin/category/CategoryHeader';
import CategoryTable from '@/components/admin/category/CategoryTable';
import CategoryForm from '@/components/admin/category/CategoryForm';
import CategoryPagination from '@/components/admin/category/CategoryPagination';
import DeleteConfirmModal from '@/components/admin/category/DeleteConfirmModal';

export default function CategoryManagement() {
  const {
    categories,
    loading,
    submitting,
    error,
    totalItems,
    currentPage,
    totalPages,
    searchTerm,
    itemsPerPage,
    setCurrentPage,
    setSearchTerm,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError
  } = useCategory();

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<number | null>(null);

  // Handle create category
  const handleCreateCategory = async (data: any) => {
    const success = await createCategory(data as CreateCategoryRequest);
    if (success) {
      setIsCreateModalOpen(false);
    }
  };

  // Handle update category
  const handleUpdateCategory = async (data: any) => {
    if (!selectedCategory) return;

    const success = await updateCategory(selectedCategory.id, data as UpdateCategoryRequest);
    if (success) {
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (id: number) => {
    const success = await deleteCategory(id);
    if (success) {
      setDeleteConfirm(null);
    }
  };

  // Open edit modal
  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  // Close modals
  const closeModals = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedCategory(null);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Danh mục</h1>
          <p className="text-gray-600">Quản lý các danh mục sự kiện</p>
        </div>

        {/* Search and Create Header */}
        <CategoryHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          onCreateClick={() => setIsCreateModalOpen(true)}
        />

        {/* Categories Table */}
        <CategoryTable
          categories={categories}
          loading={loading}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onEdit={openEditModal}
          onDelete={setDeleteConfirm}
        />

        {/* Pagination */}
        <CategoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />

        {/* Create Modal */}
        <CategoryForm
          isOpen={isCreateModalOpen}
          onClose={closeModals}
          onSubmit={handleCreateCategory}
          submitting={submitting}
          title="Thêm danh mục mới"
          submitButtonText="Lưu"
        />

        {/* Edit Modal */}
        <CategoryForm
          isOpen={isEditModalOpen}
          onClose={closeModals}
          onSubmit={handleUpdateCategory}
          submitting={submitting}
          category={selectedCategory}
          title="Chỉnh sửa danh mục"
          submitButtonText="Cập nhật"
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteConfirm !== null}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => deleteConfirm && handleDeleteCategory(deleteConfirm)}
        />
      </div>
    </div>
  );
}
