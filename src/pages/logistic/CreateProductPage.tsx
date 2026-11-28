import {useNavigate} from 'react-router-dom';
import ProductCreateWizard from '@/components/logistic/ProductCreateWizard';
import {ROUTES} from '@/router/routes';
export default function CreateProductPage(){const navigate=useNavigate();return <ProductCreateWizard onClose={()=>navigate(ROUTES.LOGISTICS_INVENTORY)}/>;}
