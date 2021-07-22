//proj
import book from "routes/book";

/**
 * Configure each navigation button
 */
export default () => {

    return [
        {
            title: "HOME",
            path: book.home
        },
        {
            title: "FRONT GENERATOR",
            path: book.frontendBoilerplateGenerator,
        },
        {
            title: "BACK GENERATOR",
            path: book.backendBoilerplateGenerator,
        },
    ];
}