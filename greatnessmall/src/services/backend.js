const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://127.0.0.1:8000";



const getCookie = (name) => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return cookieValue
    ? decodeURIComponent(cookieValue.split("=")[1])
    : "";
};



/* Shared request helper */

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = "The request could not be completed.";

    try {
      const data = await response.json();

      if (data.detail) {
        message = data.detail;
      } else if (data.message) {
        message = data.message;
      } else if (
        data &&
        typeof data === "object"
      ) {
        const firstError = Object.values(data)
          .flat()
          .find(Boolean);

        if (firstError) {
          message = String(firstError);
        }
      }
    } catch {
      // Keep the general message
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

/* Products */

export const getProducts = () => {
  return request(
    `${BACKEND_URL}/products/`
  );
};


export const getProductBySlug = async (slug) => {
  const data = await request(
    `${BACKEND_URL}/products/${encodeURIComponent(slug)}/`
  );

  return {
    ...data,
    benefits: Array.isArray(data?.benefits)
      ? data.benefits
      : [],
    ingredients: Array.isArray(data?.ingredients)
      ? data.ingredients
      : [],
  };
};;


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


export const submitOptIn = async (payload) => {
  const csrfToken = getCookie("csrftoken");

  return request(
    `${BACKEND_URL}/leads/submit/`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(payload),
    }
  );
};



export const getPublicCsrfToken = () => {
  return request(
    `${BACKEND_URL}/core/admin/csrf/`,
    {
      method: "GET",
      credentials: "include",
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


export const getAdminOptInCampaign = () => {
  return adminRequest(
    `${BACKEND_URL}/leads/admin/optin/`
  );
};


export const updateAdminOptInCampaign = (
  formData
) => {
  return adminRequest(
    `${BACKEND_URL}/leads/admin/optin/`,
    {
      method: "PATCH",
      body: formData,
    }
  );
};


export const getAdminOptInSubmissions = (
  params = {}
) => {
  const searchParams =
    new URLSearchParams();

  if (params.status) {
    searchParams.set(
      "status",
      params.status
    );
  }

  if (params.search) {
    searchParams.set(
      "search",
      params.search
    );
  }

  const query =
    searchParams.toString();

  return adminRequest(
    `${BACKEND_URL}/leads/admin/submissions/${
      query ? `?${query}` : ""
    }`
  );
};


export const updateAdminOptInSubmission = (
  id,
  data
) => {
  return adminRequest(
    `${BACKEND_URL}/leads/admin/submissions/${encodeURIComponent(
      id
    )}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(
        data
      ),
    }
  );
};


export const getAdminTwiContent = () =>
  adminRequest(`${BACKEND_URL}/twi/admin/`);

export const createAdminTwiContent = (formData) =>
  adminRequest(`${BACKEND_URL}/twi/admin/`, {
    method: "POST",
    body: formData,
  });

export const updateAdminTwiContent = (id, formData) =>
  adminRequest(`${BACKEND_URL}/twi/admin/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    body: formData,
  });

export const deleteAdminTwiContent = (id) =>
  adminRequest(`${BACKEND_URL}/twi/admin/${encodeURIComponent(id)}/`, {
    method: "DELETE",
  });


  export const getAdminTestimonials = () =>
  adminRequest(`${BACKEND_URL}/testimonials/admin/`);

export const createAdminTestimonial = (formData) =>
  adminRequest(`${BACKEND_URL}/testimonials/admin/`, {
    method: "POST",
    body: formData,
  });

export const updateAdminTestimonial = (id, formData) =>
  adminRequest(`${BACKEND_URL}/testimonials/admin/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    body: formData,
  });

export const deleteAdminTestimonial = (id) =>
  adminRequest(`${BACKEND_URL}/testimonials/admin/${encodeURIComponent(id)}/`, {
    method: "DELETE",
  });

export const getAdminFaqs = () =>
  adminRequest(`${BACKEND_URL}/admin-api/faqs/`);

export const createAdminFaq = (data) =>
  adminRequest(`${BACKEND_URL}/admin-api/faqs/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateAdminFaq = (id, data) =>
  adminRequest(`${BACKEND_URL}/admin-api/faqs/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteAdminFaq = (id) =>
  adminRequest(`${BACKEND_URL}/admin-api/faqs/${encodeURIComponent(id)}/`, {
    method: "DELETE",
  });

export const getAdminFaqCategories = () =>
  adminRequest(`${BACKEND_URL}/admin-api/faqs/categories/`);

export const createAdminFaqCategory = (data) =>
  adminRequest(`${BACKEND_URL}/admin-api/faqs/categories/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteAdminFaqCategory = (id) =>
  adminRequest(`${BACKEND_URL}/admin-api/faqs/categories/${encodeURIComponent(id)}/`, {
    method: "DELETE",
  });


  export const getAdminSMSCustomers = () =>
  adminRequest(`${BACKEND_URL}/sms/admin/customers/`);

export const sendAdminSMSBroadcast = (message) =>
  adminRequest(`${BACKEND_URL}/sms/admin/broadcast/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });


  export const sendAdminSMSToContact = (id, message) =>
  adminRequest(
    `${BACKEND_URL}/sms/admin/contact/${encodeURIComponent(id)}/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    }
  );


  export const getAdminRecoveryPhone = () =>
  adminRequest(`${BACKEND_URL}/core/admin/recovery-phone/`);

export const saveAdminRecoveryPhone = (phone) =>
  adminRequest(`${BACKEND_URL}/core/admin/recovery-phone/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone }),
  });



 export const requestPasswordResetSMS = (phone) =>
  request(`${BACKEND_URL}/core/password-reset/request/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

export const confirmPasswordResetSMS = (phone, code, newPassword) =>
  request(`${BACKEND_URL}/core/password-reset/confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone,
      code,
      new_password: newPassword,
    }),
  }); 




  export const changeAdminPassword = (
  currentPassword,
  newPassword
) =>
  adminRequest(
    `${BACKEND_URL}/core/admin/change-password/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    }
  );