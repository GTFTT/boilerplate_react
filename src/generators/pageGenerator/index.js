
//own
import { lines } from "utils";
import poorPageGenerator from "./poorPageGenerator"

export default ({pageName, moduleDescription, generatingComponent, actions}) => {

    const generatePoorPage = () => {
        const {
            generateImports,
            generateMapStateToProps,
            generateMapDispatchToProps,
        } = poorPageGenerator({actions});

        return lines([
            generateImports(),
            generateMapStateToProps(),
            ``,
            generateMapDispatchToProps(),
        ]);
    };

    return {
        generatePoorPage
    };
}