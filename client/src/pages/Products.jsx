import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import './Products.css';

const Products = () => {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // 카테고리 필터링
    if (category) {
      const filtered = products.filter(p => p.category === category);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [category, products]);

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


  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="products">
      <div className="products-header">
        <h1>{category ? `${category} 상품` : '전체 상품'}</h1>
        {category && (
          <Link to="/products" className="btn btn-outline btn-sm">
            전체 보기
          </Link>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>{category ? `${category} 카테고리에 등록된 상품이 없습니다.` : '등록된 상품이 없습니다.'}</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="no-image">이미지 없음</div>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-details">
                  <span className="product-price">{product.price?.toLocaleString()}원</span>
                  <span className="product-category">{product.category}</span>
                </div>
                <div className="product-stock">재고: {product.stock}개</div>
                <div className="product-actions">
                  <Link to={`/products/${product._id}`} className="btn btn-outline btn-action">
                    상세보기
                  </Link>
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      alert('장바구니에 추가되었습니다!');
                    }}
                    className="btn btn-primary btn-action"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? '품절' : '장바구니'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
