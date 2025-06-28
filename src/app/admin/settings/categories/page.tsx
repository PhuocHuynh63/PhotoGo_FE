import AdminCategoriesPage from "@pages/Admin/Settings/Categories";
import categoryService from "@services/categories";
import { ICategoriesResponse } from "@models/category/response.model";

async function getCategories() {
    const response = await categoryService.getCategories() as ICategoriesResponse;
    return response.data;
}

export default async function CategoriesPage() {
    const categoriesData = await getCategories();

    return <AdminCategoriesPage categories={categoriesData.data} pagination={categoriesData.pagination} />;
}
