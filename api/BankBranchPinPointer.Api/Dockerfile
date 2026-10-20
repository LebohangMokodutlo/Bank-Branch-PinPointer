# Build stage: full SDK image, only used to restore/compile/publish.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files first so Docker can cache the `dotnet restore` layer and skip it on
# rebuilds where only source files (not dependencies) changed.
COPY BankBranchPinPointer.Api/BankBranchPinPointer.Api.csproj BankBranchPinPointer.Api/
RUN dotnet restore BankBranchPinPointer.Api/BankBranchPinPointer.Api.csproj

COPY BankBranchPinPointer.Api/ BankBranchPinPointer.Api/
RUN dotnet publish BankBranchPinPointer.Api/BankBranchPinPointer.Api.csproj -c Release -o /app --no-restore

# Runtime stage: much smaller image containing only the ASP.NET Core runtime + published output.
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "BankBranchPinPointer.Api.dll"]
