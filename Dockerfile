# Root Dockerfile not used; keeping as thin helper to document build entrypoints.
# Frontend/Backend now have dedicated Dockerfiles under frontend/ and backend/.
FROM scratch
CMD ["/bin/true"]
