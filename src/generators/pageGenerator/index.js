
//own
import { lines } from "utils";
import poorPageGenerator from "./poorPageGenerator"

export default ({pageName, moduleDescription, generatingComponent, actions}) => {

    const generatePoorPage = () => {
        const {
            generateImports,
            generateMapStateToProps,
            generateMapDispatchToProps,
            generateClass,
        } = poorPageGenerator({moduleDescription, actions});

        return lines([
            generateImports(),
            generateMapStateToProps(),
            ``,
            generateMapDispatchToProps(),
            ``,
            generateClass(),
        ]);
    };

    return {
        generatePoorPage
    };
}