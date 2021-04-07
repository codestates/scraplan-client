import React from "react";
import { Link, useParams } from 'react-router-dom';

function MainPage() {
  const { userid } : any = useParams();

  return <>
    <div>
      <Link to={{ pathname: `/feedpage/${userid}` }}><button>내 일정 만들기</button></Link>
      <Link to='planpage'><button>남의 일정 구경하기</button></Link>
    </div>
  </>;;
}

export default MainPage;
