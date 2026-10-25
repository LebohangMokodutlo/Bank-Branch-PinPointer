const NotAuthorisedPage = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <h1 className="text-lg font-semibold text-gray-900">Not authorised</h1>
      <p className="mt-2 text-sm text-gray-500">
        This page is only available in admin mode.
      </p>
    </div>
  );
};

export default NotAuthorisedPage;
