
//own
import { lines } from "utils";
import poorPageGenerator from "./poorPageGenerator"

export default ({pageName, moduleDescription, generatingComponent, actions}) => {

    const generatePoorPage = () => {
        const {
            generateImports,
            generateMapStateToProps
        } = poorPageGenerator({actions});

        return lines([
            generateImports(),
            generateMapStateToProps()
        ]);
    };

    return {
        generatePoorPage
    };
}