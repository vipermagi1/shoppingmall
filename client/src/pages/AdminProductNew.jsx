import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import './AdminProductNew.css';

const AdminProductNew = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
    stock: '0'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 이미지 URL이 변경되면 미리보기 업데이트
    if (name === 'image') {
      setImagePreview(value);
    }
  };

  // Cloudinary Upload Widget 열기
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
        maxFileSize: 5000000, // 5MB
        resourceType: 'image'
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          // 업로드 성공 시 이미지 URL 설정
          const imageUrl = result.info.secure_url;
          setFormData(prev => ({
            ...prev,
            image: imageUrl
          }));
          setImagePreview(imageUrl);
        } else if (error) {
          console.error('Cloudinary 업로드 오류:', error);
          setError('이미지 업로드 중 오류가 발생했습니다.');
        }
      }
    );

    widget.open();
  };

  // 컴포넌트 마운트 시 Cloudinary 스크립트 로드 확인
  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.sku || !formData.name || !formData.price || !formData.category) {
      setError('필수 항목(SKU, 상품명, 가격, 카테고리)을 모두 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image.trim() || '',
        description: formData.description.trim() || '',
        stock: parseInt(formData.stock) || 0
      };

      await productService.createProduct(productData);
      navigate('/admin/products');
    } catch (err) {
      if (err.response?.data?.error) {
        const errorMsg = err.response.data.error;
        if (errorMsg.includes('sku') || errorMsg.includes('SKU')) {
          setError('이미 사용 중인 SKU입니다. 다른 SKU를 입력해주세요.');
        } else {
          setError(errorMsg);
        }
      } else {
        setError('상품 등록 중 오류가 발생했습니다.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-product-new">
      <h1>상품 등록</h1>
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>상품 SKU *</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
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
            value={formData.name}
            onChange={handleChange}
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
              value={formData.price}
              onChange={handleChange}
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
              value={formData.stock}
              onChange={handleChange}
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
            value={formData.category}
            onChange={handleChange}
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
              value={formData.image}
              onChange={handleChange}
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
                  setFormData(prev => ({ ...prev, image: '' }));
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
            value={formData.description}
            onChange={handleChange}
            rows="5"
            placeholder="상품 설명을 입력해주세요 (선택사항)"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '등록 중...' : '상품 등록'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn btn-outline"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductNew;
