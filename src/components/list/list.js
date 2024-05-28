import UserInfo from '../list/userInfo/userInfo';
import ChatList from './chatList/chatList';
import '../list/list.css'
const List = () => {
    return(
        <div className='list'>
            <UserInfo />
            <ChatList />
        </div>
    )
}

export default List;