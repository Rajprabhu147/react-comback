function Welcome(props) {
  return (
    <h2 style={{ justifyContent: "center", textAlign: "center" }}>
      Welcome, {props.name} {props.bio && `(${props.bio})`}!
    </h2>
  );
}
export default Welcome;
