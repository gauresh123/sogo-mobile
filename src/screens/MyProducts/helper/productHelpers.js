import axiosInstance from "../../../../axiosInstance";

export const addProduct = async (
  productName,
  categoryId,
  distributorId,
  price,
  mrp,
  imageUrl,
  gstRate,
  subscriptionEnabled
) => {
  try {
    const { data } = await axiosInstance.post("product/v2", {
      productName,
      price: Number(price).toFixed(2),
      mrp: Number(mrp).toFixed(2),
      categoryId,
      distributorId,
      discount: null,
      manufacturer: null,
      image: imageUrl,
      gstRate: gstRate,
      subscriptionEnabled,
    });
    return { data: data.data };
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export async function updateProduct(
  productId,
  productName,
  price,
  mrp,
  categoryId,
  image,
  gstRate,
  subscriptionEnabled
) {
  try {
    const response = await axiosInstance.put("/product", {
      productId: productId,
      productName: productName,
      price: price,
      mrp: mrp,
      discount: null,
      manufacturer: null,
      categoryId: categoryId,
      image: image,
      gstRate: gstRate,
      subscriptionEnabled,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
}
