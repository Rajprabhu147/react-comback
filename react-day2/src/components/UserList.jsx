import UserCard from "./UserCard";

function UserList({ users }) {
  // user = array of user objects form app
  return (
    <div className="user-list">
      {users.length > 0 ? (
        users.map((user, index) => (
          <UserCard
            key={index}
            name={user.name}
            age={user.age}
            bio={user.bio}
            exp={user.exp}
          />
        ))
      ) : (
        <p className="no-users">No users found</p>
      )}
    </div>
  );
}

export default UserList;
