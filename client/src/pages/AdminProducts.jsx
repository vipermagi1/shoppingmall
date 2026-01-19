import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import './AdminProducts.css';
import './AdminProductNew.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    sku: '',
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
    stock: '0'
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.data || []);
      setError(null);
    } catch (err) {
      setError('상품을 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await productService.deleteProduct(id);
      loadProducts();
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setEditFormData({
      sku: product.sku || '',
      name: product.name || '',
      price: product.price?.toString() || '',
      category: product.category || '',
      image: product.image || '',
      description: product.description || '',
      stock: product.stock?.toString() || '0'
    });
    setImagePreview(product.image || '');
    setEditError(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
    
    if (name === 'image') {
      setImagePreview(value);
    }
  };

  const openCloudinaryWidget = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset';

    const widget = window.cloudinary?.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        cropping: false,
        folder: 'shopping-mall/products',
        maxFileSize: 5000000,
        resourceType: 'image'
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          const imageUrl = result.info.secure_url;
          setEditFormData(prev => ({
            ...prev,
            image: imageUrl
          }));
          setImagePreview(imageUrl);
        } else if (error) {
          console.error('Cloudinary 업로드 오류:', error);
          setEditError('이미지 업로드 중 오류가 발생했습니다.');
        }
      }
    );

    widget.open();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError(null);

    if (!editFormData.sku || !editFormData.name || !editFormData.price || !editFormData.category) {
      setEditError('필수 항목(SKU, 상품명, 가격, 카테고리)을 모두 입력해주세요.');
      return;
    }

    setEditLoading(true);

    try {
      const productData = {
        sku: editFormData.sku.trim(),
        name: editFormData.name.trim(),
        price: parseFloat(editFormData.price),
        category: editFormData.category,
        image: editFormData.image.trim() || '',
        description: editFormData.description.trim() || '',
        stock: parseInt(editFormData.stock) || 0
      };

      await productService.updateProduct(editingProduct, productData);
      setEditingProduct(null);
      loadProducts(); // 목록 갱신
    } catch (err) {
      if (err.response?.data?.error) {
        const errorMsg = err.response.data.error;
        if (errorMsg.includes('sku') || errorMsg.includes('SKU')) {
          setEditError('이미 사용 중인 SKU입니다. 다른 SKU를 입력해주세요.');
        } else {
          setEditError(errorMsg);
        }
      } else {
        setEditError('상품 수정 중 오류가 발생했습니다.');
      }
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditFormData({
      sku: '',
      name: '',
      price: '',
      category: '',
      image: '',
      description: '',
      stock: '0'
    });
    setImagePreview('');
    setEditError(null);
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>상품 관리</h1>
        <Link to="/admin/products/new" className="btn btn-primary">
          새 상품 등록
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <p>등록된 상품이 없습니다.</p>
          <Link to="/admin/products/new" className="btn btn-primary">
            상품 등록하기
          </Link>
        </div>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>이미지</th>
                <th>상품명</th>
                <th>카테고리</th>
                <th>가격</th>
                <th>재고</th>
                <th>평점</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <Link to={`/products/${product._id}`} className="product-link-cell">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="product-thumb" />
                      ) : (
                        <div className="no-image-thumb">이미지 없음</div>
                      )}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/products/${product._id}`} className="product-link-cell">
                      {product.name}
                    </Link>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.price?.toLocaleString()}원</td>
                  <td>{product.stock}개</td>
                  <td>
                    {product.rating > 0 ? (
                      <span className="rating">⭐ {product.rating.toFixed(1)}</span>
                    ) : (
                      <span className="no-rating">평점 없음</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(product)}
                        className="btn btn-primary btn-sm"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="btn btn-danger btn-sm"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 수정 모달 */}
      {editingProduct && (
        <div className="edit-modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2>상품 수정</h2>
              <button className="close-button" onClick={handleCancelEdit}>×</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="product-form">
              <div className="form-group">
                <label>상품 SKU *</label>
                <input
                  type="text"
                  name="sku"
                  value={editFormData.sku}
                  onChange={handleEditChange}
                  placeholder="예: PROD-001"
                  required
                />
                <span className="form-hint">고유한 상품 코드를 입력해주세요</span>
              </div>

              <div className="form-group">
                <label>상품명 *</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  placeholder="상품명을 입력해주세요"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>가격 (원) *</label>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditChange}
                    min="0"
                    step="100"
                    placeholder="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>재고 *</label>
                  <input
                    type="number"
                    name="stock"
                    value={editFormData.stock}
                    onChange={handleEditChange}
                    min="0"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>카테고리 *</label>
                <select
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">카테고리 선택</option>
                  <option value="상의">상의</option>
                  <option value="하의">하의</option>
                  <option value="아우터">아우터</option>
                  <option value="신발">신발</option>
                  <option value="가방">가방</option>
                  <option value="액세서리">액세서리</option>
                  <option value="모자">모자</option>
                  <option value="시계">시계</option>
                  <option value="주얼리">주얼리</option>
                </select>
              </div>

              <div className="form-group">
                <label>이미지</label>
                <div className="image-upload-section">
                  <button
                    type="button"
                    onClick={openCloudinaryWidget}
                    className="btn btn-upload"
                  >
                    Cloudinary에서 이미지 업로드
                  </button>
                  <span className="upload-or">또는</span>
                  <input
                    type="url"
                    name="image"
                    value={editFormData.image}
                    onChange={handleEditChange}
                    placeholder="이미지 URL을 직접 입력하세요"
                    className="image-url-input"
                  />
                </div>
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="상품 미리보기" />
                    <button
                      type="button"
                      onClick={() => {
                        setEditFormData(prev => ({ ...prev, image: '' }));
                        setImagePreview('');
                      }}
                      className="btn-remove-image"
                    >
                      이미지 제거
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>상품 설명</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows="5"
                  placeholder="상품 설명을 입력해주세요 (선택사항)"
                />
              </div>

              {editError && <div className="error-message">{editError}</div>}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={editLoading}>
                  {editLoading ? '수정 중...' : '수정 완료'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-outline"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
