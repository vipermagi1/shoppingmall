import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import './Home.css';

const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      const allProducts = response.data || [];
      setProducts(allProducts);
      // 최신 상품 12개를 추천 상품으로
      setFeaturedProducts(allProducts.slice(0, 12));
    } catch (err) {
      console.error('상품 로딩 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart(product, 1);
      alert('장바구니에 추가되었습니다!');
    }
  };

  return (
    <div className="home">
      {/* 메인 배너 */}
      <div className="main-banner">
        <div className="banner-content">
          <h2>2026 뉴 시즌 컬렉션</h2>
          <p>트렌디한 스타일을 만나보세요</p>
          <Link to="/products" className="btn btn-banner">
            지금 쇼핑하기
          </Link>
        </div>
      </div>

      {/* 추천 상품 섹션 */}
      <section className="section featured-section">
        <div className="section-header">
          <h2 className="section-title">추천 상품</h2>
          <Link to="/products" className="section-link">
            전체보기 →
          </Link>
        </div>
        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : featuredProducts.length === 0 ? (
          <div className="empty-state">등록된 상품이 없습니다.</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <Link to={`/products/${product._id}`} className="product-link">
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className="no-image">이미지 없음</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{product.price?.toLocaleString()}원</p>
                    <span className="product-category">{product.category}</span>
                  </div>
                </Link>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn-cart"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? '품절' : '장바구니'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 카테고리별 섹션 */}
      <section className="section category-section">
        <div className="category-nav">
          <Link to="/products?category=상의" className="category-item">상의</Link>
          <Link to="/products?category=하의" className="category-item">하의</Link>
          <Link to="/products?category=아우터" className="category-item">아우터</Link>
          <Link to="/products?category=신발" className="category-item">신발</Link>
          <Link to="/products?category=가방" className="category-item">가방</Link>
          <Link to="/products?category=액세서리" className="category-item">액세서리</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
