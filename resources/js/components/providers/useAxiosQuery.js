import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import $ from "jquery";
import { apiUrl, token } from "./companyInfo";

export function POST(url, key_name, isLoading, onSuccessFunction) {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      console.log("isLoading", isLoading);
      if (!isLoading) {
        $(".globalLoading").removeClass("hide");
      }
      return axios
        .post(`${apiUrl}${url}`, data, {
          headers: {
            Authorization: token(),
          },
        })
        .then((res) => res.data);
    },
    {
      onSuccess: () => {
        if (onSuccessFunction) onSuccessFunction();
        if (key_name) {
          if (typeof key_name === "string") {
            queryClient.refetchQueries(key_name);
          } else {
            key_name.forEach((name) => {
              queryClient.refetchQueries(name);
            });
          }
        }
        $(".globalLoading").addClass("hide");
      },
      onError: () => {
        $(".globalLoading").addClass("hide");
      },
    }
  );
}

export function POSTFILE(url, key_name, onSuccessFunction) {
  const queryClient = useQueryClient();

  return useMutation(
    (data) => {
      $(".globalLoading").removeClass("hide");
      return axios
        .post(`${apiUrl}${url}`, data, {
          headers: {
            Authorization: token(),
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data);
    },
    {
      onSuccess: () => {
        if (onSuccessFunction) onSuccessFunction();
        if (key_name) {
          if (typeof key_name === "string") {
            queryClient.refetchQueries(key_name);
          } else {
            key_name.forEach((name) => {
              queryClient.refetchQueries(name);
            });
          }
        }
        $(".globalLoading").addClass("hide");
      },
      onError: () => {
        $(".globalLoading").addClass("hide");
      },
    }
  );
}

export function UPDATE(url, key_name, onSuccessFunction) {
  const queryClient = useQueryClient();

  return useMutation(
    (data) => {
      $(".globalLoading").removeClass("hide");
      return axios
        .put(`${apiUrl}${url}/${data.id}`, data, {
          headers: {
            Authorization: token(),
          },
        })
        .then((res) => res.data);
    },
    {
      onSuccess: () => {
        if (onSuccessFunction) onSuccessFunction();
        // console.log(key_name);
        if (key_name) {
          if (typeof key_name === "string") {
            queryClient.refetchQueries(key_name);
          } else {
            key_name.forEach((name) => {
              queryClient.refetchQueries(name);
            });
          }
        }
        $(".globalLoading").addClass("hide");
      },
      onError: () => {
        $(".globalLoading").addClass("hide");
      },
    }
  );
}

export function DELETE(url, key_name, onSuccessFunction) {
  const queryClient = useQueryClient();

  return useMutation(
    (data) => {
      $(".globalLoading").removeClass("hide");
      return axios
        .delete(`${apiUrl}${url}/${data.id}`, {
          headers: {
            Authorization: token(),
          },
        })
        .then((res) => res.data);
    },
    {
      onSuccess: () => {
        if (onSuccessFunction) onSuccessFunction();
        if (key_name) {
          if (typeof key_name === "string") {
            queryClient.refetchQueries(key_name);
          } else {
            key_name.forEach((name) => {
              queryClient.refetchQueries(name);
            });
          }
        }
        $(".globalLoading").addClass("hide");
      },
      onError: () => {
        $(".globalLoading").addClass("hide");
      },
    }
  );
}

export function GET(url, key_name, onSuccessFunction, allowLoading = true) {
  return useQuery(
    key_name,
    () => {
      if (allowLoading) {
        $(".globalLoading").removeClass("hide");
      }
      return axios
        .get(`${apiUrl}${url}`, {
          headers: {
            Authorization: token(),
          },
        })
        .then((res) => res.data);
    },
    {
      retry: 1,
      retryDelay: 500,
      fetchOnWindowFocus: false,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (onSuccessFunction) onSuccessFunction(res);
        $(".globalLoading").addClass("hide");
      },
      onError: () => {
        $(".globalLoading").addClass("hide");
      },
    }
  );
}

export function GETMANUAL(
  url,
  key_name,
  onSuccessFunction,
  allowLoading = true
) {
  return useQuery(
    key_name,
    () => {
      if (allowLoading) {
        $(".globalLoading").removeClass("hide");
      }
      return axios
        .get(`${apiUrl}${url}`, {
          headers: {
            Authorization: token(),
          },
        })
        .then((res) => res.data);
    },
    {
      enabled: false,
      retry: 1,
      retryDelay: 500,
      fetchOnWindowFocus: false,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (onSuccessFunction) onSuccessFunction(res);
        $(".globalLoading").addClass("hide");
      },
      onError: () => {
        $(".globalLoading").addClass("hide");
      },
    }
  );
}

export function GETWITHOUTLOADING(url, key_name, onSuccessFunction) {
  return useQuery(
    key_name,
    () => {
      //    $(".globalLoading").removeClass("hide");
      return axios
        .get(`${apiUrl}${url}`, {
          headers: {
            Authorization: token(),
          },
        })
        .then((res) => res.data);
    },
    {
      enabled: false,
      retry: 1,
      retryDelay: 500,
      fetchOnWindowFocus: false,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (onSuccessFunction) onSuccessFunction(res);
        //    $(".globalLoading").addClass("hide");
      },
      onError: () => {
        //    $(".globalLoading").addClass("hide");
      },
    }
  );
}

export function POSTMANUAL(settoken, url, key_name, onSuccessFunction) {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      $(".globalLoading").removeClass("hide");
      return axios
        .post(`${apiUrl}${url}`, data, {
          headers: {
            Authorization: settoken,
          },
        })
        .then((res) => res.data);
    },
    {
      onSuccess: () => {
        if (onSuccessFunction) onSuccessFunction();
        if (key_name) {
          if (typeof key_name === "string") {
            queryClient.refetchQueries(key_name);
          } else {
            key_name.forEach((name) => {
              queryClient.refetchQueries(name);
            });
          }
        }
        $(".globalLoading").addClass("hide");
      },
      onError: () => {
        $(".globalLoading").addClass("hide");
      },
    }
  );
}
