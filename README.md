## Hello Pulumi!

This repository demonstrates how to deploy a sample Spring
Boot app into multiple Kubernetes environments using [Pulumi and
Spinnaker](https://www.pulumi.com/docs/guides/continuous-delivery/spinnaker/).

Here's the intended workflow:

1. A developer makes changes to this repo.
1. When they're ready to deploy their changes, they push a tag of the form `v*` to
   this repo.
1. This tag kicks off a GitHub action that builds a Docker image and pushes
   it to a container repository.
1. Spinnaker is watching the container repo. When it sees a new image tag, it starts a pipeline that uses Pulumi
   to deploy the image into an ephemeral QA environment running in Kubernetes.
1. The pipeline waits for manual QA approval.
1. At this point, the pipeline forks depending on the QA outcome. In all
   cases, the QA environment will be destroyed. If the QA outcome is a `pass`, then the new image will be deployed to the production environment.

At the moment, there's nothing Spinnaker-specific in this repo. In the
future, it will include a set of sample pipelines that enable the full workflow
as described above.

