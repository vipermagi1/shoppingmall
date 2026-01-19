import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data || []);
      setError(null);
    } catch (err) {
      setError('사용자를 불러오는 중 오류가 발생했습니다.');
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
      await userService.deleteUser(id);
      loadUsers();
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="users">
      <div className="users-header">
        <h1>사용자 목록</h1>
        <Link to="/users/new" className="btn btn-primary">
          새 사용자 추가
        </Link>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>등록된 사용자가 없습니다.</p>
        </div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>역할</th>
                <th>주소</th>
                <th>전화번호</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'admin' ? '관리자' : '사용자'}
                    </span>
                  </td>
                  <td>{user.address || '-'}</td>
                  <td>{user.phone || '-'}</td>
                  <td>
                    <div className="user-actions">
                      <Link to={`/users/${user._id}`} className="btn btn-outline btn-sm">
                        상세
                      </Link>
                      <button
                        onClick={() => handleDelete(user._id)}
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
    </div>
  );
};

export default Users;
