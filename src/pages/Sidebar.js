import React, { useState } from 'react';
import styled from 'styled-components';

// 사이드바 접고 펴는 토글 버튼
const ToggleButton = styled.button`
  padding: 5px 10px;
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

// isCollapsed prop에 따라 너비를 20px 또는 200px로 조절하고 CSS 트랜지션 효과를 적용 (20px인 이유는 접었을 때 토글 버튼이 보이게 하기 위해서)
const SidebarContainer = styled.div`
  width: ${({ isCollapsed }) => (isCollapsed ? '20px' : '200px')};
  overflow: hidden;
  transition: width 0.3s;
  background-color: #f5f5f5;
`;

// 사이드바가 접혀 있는 경우에 사이드바 내부의 컨텐츠가 모두 표시되지 않게 함 
const SidebarContent = styled.div`
  display: ${({ isCollapsed }) => (isCollapsed ? 'none' : 'block')};
`;

const Menu = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #e5e5e5;
  }
`;

const Sidebar = () => {
  // 사이드바 상태
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 사이드바 토글 버튼 이벤트
  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMenuClick = (menuItem) => {
    // 메뉴 클릭 이벤트 처리 로직
    console.log(`${menuItem} 메뉴 클릭`);
  };

  return (
    /* 사이드바가 접히고 펼쳐지는 기능 */
    <SidebarContainer isCollapsed={isCollapsed}>
      <ToggleButton onClick={handleToggleSidebar}>
        {isCollapsed ? '>' : '<'}
      </ToggleButton>
      <SidebarContent isCollapsed={isCollapsed}> {/* 사이드바를 토글하였을 때 사이드바 내부의 컨텐츠를 숨기는 코드 */}
      <Menu>
        <MenuItem onClick={() => handleMenuClick('메뉴1')}>메뉴1</MenuItem>
        <MenuItem onClick={() => handleMenuClick('메뉴2')}>메뉴2</MenuItem>
        <MenuItem onClick={() => handleMenuClick('메뉴3')}>메뉴3</MenuItem>
        {/* 추가적인 메뉴 아이템들 */}
      </Menu>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;

