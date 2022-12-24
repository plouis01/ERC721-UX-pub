import { NavLink } from 'react-router-dom';

function NotFound(){
    return (
        <div>
            <text>ERROR 404 : Page not found</text>
            <div>
                <button><NavLink to="/" exact>Home</NavLink></button>
            </div>
        </div>
    )
}

export default NotFound; 