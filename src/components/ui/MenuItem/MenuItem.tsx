import React from "react";

export interface MenuItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  className?: string;
  as?: React.ElementType;
}

const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps>(
  (
    {
      icon,
      children,
      disabled = false,
      onClick,
      className = "",
      as: Component = "li",
      ...rest
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick?.(e);
    };

    return (
      <Component
        ref={ref}
        className={`menu-item${disabled ? " menu-item--disabled" : ""}${className ? " " + className : ""}`}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        {...rest}
      >
        {icon && <span className="menu-item__icon">{icon}</span>}
        <span className="menu-item__content">{children}</span>
      </Component>
    );
  }
);

MenuItem.displayName = "MenuItem";

export default MenuItem;
