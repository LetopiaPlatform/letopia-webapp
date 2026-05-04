import { Link } from 'react-router-dom';
import { Button } from './ui/button';

interface EmptyStateProps {
  image?: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  image,
  icon,
  title,
  description,
  actionLabel,
  actionIcon,
  actionHref,
  onAction,
}: EmptyStateProps) => {
  const hasAction = !!actionLabel && (!!actionHref || !!onAction);

  return (
    <div className="flex flex-col items-center gap-3 md:gap-4 py-4 lg:py-8 text-center max-w-sm mx-auto">
      {image && <img src={image} alt="" role="presentation" className={'w-40 opacity-80'} />}
      {!image && icon && (
        <span aria-hidden="true" className="text-muted-foreground">
          {icon}
        </span>
      )}
      <p className="text-md lg:text-lg font-semibold text-primary">{title}</p>
      {description && <p className="text-xs md:text-sm text-muted-foreground">{description}</p>}
      {hasAction &&
        (actionHref ? (
          <Button
            asChild
            variant="default"
            className="has-[>svg]:px-5 sm:has-[>svg]:px-7  py-5 md:py-6 rounded-xl text-white text-base sm:text-lg font-normal cursor-pointer"
          >
            <Link to={actionHref}>
              {actionIcon}
              {actionLabel}
            </Link>
          </Button>
        ) : (
          <Button
            onClick={onAction}
            variant="default"
            className="has-[>svg]:px-5 sm:has-[>svg]:px-7  py-5 md:py-6 rounded-xl text-white text-base sm:text-lg font-normal cursor-pointer"
          >
            {actionIcon}
            {actionLabel}
          </Button>
        ))}
    </div>
  );
};
