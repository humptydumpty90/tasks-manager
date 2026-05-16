import './style.scss';

interface LogoProps {
  className?: string
  onClick?: () => void
}

export const Logo = ({ className = '', onClick }: LogoProps) => {
  return (
    <h1
      className={ `${className} logo` }
      onClick={ onClick }
    >Tasks Manager
    </h1>
  );
};
