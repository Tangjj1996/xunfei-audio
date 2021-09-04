import React from "react";

interface Props {
    className: string;
}

const Menu: React.FC<Props> = ({ className }) => {
    return <div className={className}>This is menu list</div>;
};

export default Menu;
