const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://127.0.0.1:8000";


/* Shared request helper */

const request = async (
  url,
  options = {}
) => {
  const response = await fetch(
    url,
    {
      ...options,
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}`
    );
  }

  return response.json();
};


/* Products */

export const getProducts = () => {
  return request(
    `${BACKEND_URL}/products/`
  );
};


export const getProductBySlug = (
  slug
) => {
  return request(
    `${BACKEND_URL}/products/${encodeURIComponent(
      slug
    )}/`
  );
};


export const getProductCategories =
  () => {
    return request(
      `${BACKEND_URL}/products/categories/`
    );
  };


/* Events */

export const getEvents = () => {
  return request(
    `${BACKEND_URL}/events/`
  );
};


export const getEventBySlug = (
  slug
) => {
  return request(
    `${BACKEND_URL}/events/${encodeURIComponent(
      slug
    )}/`
  );
};


/* Leads */

export const getOptInCampaign = () => {
  return request(
    `${BACKEND_URL}/leads/optin/`
  );
};


export const submitOptIn = (
  payload
) => {
  return request(
    `${BACKEND_URL}/leads/submit/`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body:
        JSON.stringify(
          payload
        ),
    }
  );
};


/* FAQs */

export const getFaqs = (
  params = {}
) => {
  const searchParams =
    new URLSearchParams();

  if (params.category) {
    searchParams.set(
      "category",
      params.category
    );
  }

  if (params.search) {
    searchParams.set(
      "search",
      params.search
    );
  }

  if (params.featured) {
    searchParams.set(
      "featured",
      "true"
    );
  }

  const query =
    searchParams.toString();

  const url =
    query
      ? `${BACKEND_URL}/faqs/?${query}`
      : `${BACKEND_URL}/faqs/`;

  return request(url);
};


export const getFaqCategories =
  () => {
    return request(
      `${BACKEND_URL}/faqs/categories/`
    );
  };


/* Testimonials */

export const getTestimonials = (
  params = {}
) => {
  const searchParams =
    new URLSearchParams();

  if (params.type) {
    searchParams.set(
      "type",
      params.type
    );
  }

  if (params.featured) {
    searchParams.set(
      "featured",
      "true"
    );
  }

  const query =
    searchParams.toString();

  const url =
    query
      ? `${BACKEND_URL}/testimonials/?${query}`
      : `${BACKEND_URL}/testimonials/`;

  return request(url);
};

/* Twi content */

export const getTwiContent = (
  params = {}
) => {
  const searchParams =
    new URLSearchParams();

  if (params.type) {
    searchParams.set(
      "type",
      params.type
    );
  }

  if (params.featured) {
    searchParams.set(
      "featured",
      "true"
    );
  }

  const query =
    searchParams.toString();

  const url =
    query
      ? `${BACKEND_URL}/twi/?${query}`
      : `${BACKEND_URL}/twi/`;

  return request(url);
};


/* Admin authentication */

let csrfToken = "";


export const getAdminCsrfToken = async () => {
  const response = await fetch(
    `${BACKEND_URL}/core/admin/csrf/`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Could not initialize admin security."
    );
  }

  const data = await response.json();

  csrfToken =
    data.csrfToken || "";

  return csrfToken;
};


export const adminLogin = async (
  username,
  password
) => {
  if (!csrfToken) {
    await getAdminCsrfToken();
  }

  const response = await fetch(
    `${BACKEND_URL}/core/admin/login/`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type":
          "application/json",
        "X-CSRFToken":
          csrfToken,
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Admin login failed."
    );
  }

  return data;
};


export const getAdminSession =
  async () => {
    const response = await fetch(
      `${BACKEND_URL}/core/admin/session/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept:
            "application/json",
        },
      }
    );

    if (
      response.status === 401 ||
      response.status === 403
    ) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        "Could not verify admin session."
      );
    }

    return response.json();
  };


export const adminLogout =
  async () => {
    if (!csrfToken) {
      await getAdminCsrfToken();
    }

    const response = await fetch(
      `${BACKEND_URL}/core/admin/logout/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept:
            "application/json",
          "X-CSRFToken":
            csrfToken,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Could not sign out."
      );
    }

    csrfToken = "";

    return response.json();
  };

/* Admin request helper */

const adminRequest = async (
  url,
  options = {}
) => {
  const method =
    (
      options.method ||
      "GET"
    ).toUpperCase();

  const needsCsrf =
    ![
      "GET",
      "HEAD",
      "OPTIONS",
    ].includes(method);

  if (
    needsCsrf &&
    !csrfToken
  ) {
    await getAdminCsrfToken();
  }

  const response = await fetch(
    url,
    {
      ...options,
      credentials: "include",

      headers: {
        Accept: "application/json",

        ...(needsCsrf
          ? {
            "X-CSRFToken":
              csrfToken,
          }
          : {}),

        ...options.headers,
      },
    }
  );

  if (
    response.status === 401 ||
    response.status === 403
  ) {
    throw new Error(
      "Your administrator session has expired."
    );
  }

  if (!response.ok) {
    let message =
      "The request could not be completed.";

    try {
      const data =
        await response.json();

      if (data.detail) {
        message = data.detail;
      } else if (data.message) {
        message = data.message;
      } else if (
        data &&
        typeof data === "object"
      ) {
        const firstError =
          Object.values(data)
            .flat()
            .find(Boolean);

        if (firstError) {
          message =
            String(firstError);
        }
      }
    } catch {
      // Keep the general message
    }

    throw new Error(message);
  }

  if (
    response.status === 204
  ) {
    return null;
  }

  return response.json();
};


/* Admin products */

export const getAdminProducts =
  () => {
    return adminRequest(
      `${BACKEND_URL}/products/admin/`
    );
  };


export const getAdminProduct = (
  id
) => {
  return adminRequest(
    `${BACKEND_URL}/products/admin/${encodeURIComponent(
      id
    )}/`
  );
};


export const createAdminProduct = (
  formData
) => {
  return adminRequest(
    `${BACKEND_URL}/products/admin/`,
    {
      method: "POST",
      body: formData,
    }
  );
};


export const updateAdminProduct = (
  id,
  formData
) => {
  return adminRequest(
    `${BACKEND_URL}/products/admin/${encodeURIComponent(
      id
    )}/`,
    {
      method: "PATCH",
      body: formData,
    }
  );
};


export const deleteAdminProduct = (
  id
) => {
  return adminRequest(
    `${BACKEND_URL}/products/admin/${encodeURIComponent(
      id
    )}/`,
    {
      method: "DELETE",
    }
  );
};


/* Admin product categories */

export const getAdminCategories =
  () => {
    return adminRequest(
      `${BACKEND_URL}/products/admin/categories/`
    );
  };


export const createAdminCategory = (
  data
) => {
  return adminRequest(
    `${BACKEND_URL}/products/admin/categories/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        data
      ),
    }
  );
};


export const updateAdminCategory = (
  id,
  data
) => {
  return adminRequest(
    `${BACKEND_URL}/products/admin/categories/${encodeURIComponent(
      id
    )}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        data
      ),
    }
  );
};


export const deleteAdminCategory = (
  id
) => {
  return adminRequest(
    `${BACKEND_URL}/products/admin/categories/${encodeURIComponent(
      id
    )}/`,
    {
      method: "DELETE",
    }
  );
}; 



/* Admin events */

export const getAdminEvents = () => {
  return adminRequest(
    `${BACKEND_URL}/events/admin/`
  );
};


export const getAdminEvent = (
  id
) => {
  return adminRequest(
    `${BACKEND_URL}/events/admin/${encodeURIComponent(
      id
    )}/`
  );
};


export const createAdminEvent = (
  formData
) => {
  return adminRequest(
    `${BACKEND_URL}/events/admin/`,
    {
      method: "POST",
      body: formData,
    }
  );
};


export const updateAdminEvent = (
  id,
  formData
) => {
  return adminRequest(
    `${BACKEND_URL}/events/admin/${encodeURIComponent(
      id
    )}/`,
    {
      method: "PATCH",
      body: formData,
    }
  );
};


export const deleteAdminEvent = (
  id
) => {
  return adminRequest(
    `${BACKEND_URL}/events/admin/${encodeURIComponent(
      id
    )}/`,
    {
      method: "DELETE",
    }
  );
};