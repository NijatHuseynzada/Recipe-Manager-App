const HomePage = () => {
  return (
    <div className="container">
      <h1>Welcome to the Recipe Manager App</h1>
      <p>This app helps you manage your favorite recipes efficiently.</p>
      
      <section>
        <h2>Featured Recipe</h2>
        <div className="recipe-card">
          <h3>Spaghetti Bolognese</h3>
          <p>A classic Italian pasta dish with a rich meat sauce.</p>
        </div>
      </section>

      <section>
        <h2>My Projects</h2>
        <ul>
          <li><a href="https://github.com/your-username/project1">Project 1</a></li>
          <li><a href="https://github.com/your-username/project2">Project 2</a></li>
        </ul>
      </section>
    </div>
  );
};
