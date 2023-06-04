import products from "../products";
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import {
    Row,
    Col,
    Image,
    ListGroup,
    Card,
    Button,
    Form,
} from 'react-bootstrap';
import Rating from "../components/Rating";

const ProductScreen = () => {
    const { id: productId } = useParams();
    const product = products.find((p) => p._id === productId);


    return <div>ProductScreen</div>;
};

export default ProductScreen;
