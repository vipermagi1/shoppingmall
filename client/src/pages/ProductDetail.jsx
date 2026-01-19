import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      setError('상품을 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error || !product) {
    return (
      <div className="error">
        {error || '상품을 찾을 수 없습니다.'}
        <Link to="/products" className="btn btn-primary">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <Link to="/products" className="back-link">← 목록으로</Link>
      
      <div className="product-detail-content">
        <div className="product-detail-image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="no-image">이미지 없음</div>
          )}
        </div>
        
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <div className="product-detail-price">{product.price?.toLocaleString()}원</div>
          <div className="product-detail-category">{product.category}</div>
          <div className="product-detail-stock">재고: {product.stock}개</div>
          <p className="product-detail-description">{product.description}</p>
          
          {product.rating > 0 && (
            <div className="product-detail-rating">
              평점: {product.rating} / 5.0 ({product.numReviews}개 리뷰)
            </div>
          )}
          
          <div className="product-detail-quantity">
            <label>수량:</label>
            <div className="quantity-controls">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="quantity-btn"
              >
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="quantity-btn"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="product-detail-actions">
            <button
              onClick={() => {
                addToCart(product, quantity);
                alert('장바구니에 추가되었습니다!');
              }}
              className="btn btn-primary"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? '품절' : '장바구니에 추가'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
