import scoped_style from "./MoviesPage.module.css";

export function MoviesPage() {
  return (
    <div className={scoped_style["movies-container"]}>
      <h1>Movies</h1>
    </div>
  );
}
