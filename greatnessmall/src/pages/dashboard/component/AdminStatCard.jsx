import React from "react";

const AdminStatCard = ({
  title,
  value,
  description,
  icon: Icon,
}) => {
  return (
    <article className="admin-stat-card">

      <div className="admin-stat-top">

        <div className="admin-stat-icon">
          <Icon
            size={20}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </div>

        <span>
          {title}
        </span>

      </div>


      <strong className="admin-stat-value">
        {value}
      </strong>


      <p>
        {description}
      </p>

    </article>
  );
};

export default AdminStatCard;