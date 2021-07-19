
//own
import poorPageGenerator from "./poorPageGenerator"

export default ({pageName, moduleDescription, generatingComponent, actions}) => {

    const generatePoorPage = () => {
        const {
            generateImports,
        } = poorPageGenerator({actions});

        return generateImports();
    };

    return {
        generatePoorPage
    };
}