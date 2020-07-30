import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

const config = new pulumi.Config();

const namespace = `hello-pulumi-${pulumi.getStack()}`;
const appLabels = { app: "hello-pulumi" };

// Create a namespace for all "apps" resources in the cluster.
const ns = new k8s.core.v1.Namespace(`hello-pulumi-${pulumi.getStack()}`, {
  metadata: {
    name: namespace,
  }
});

const loadBalancer = new k8s.core.v1.Service("hello-pulumi-lb", {
  metadata: {
    namespace,
  },
  spec: {
    type: "LoadBalancer",
    selector: appLabels,
    ports: [{
      protocol: "TCP",
      port: 80,
      targetPort: 8080,
    }],
  },
});

const deployment = new k8s.apps.v1.Deployment("hello-pulumi-deployment", {
  metadata: {
    namespace
  },
  spec: {
    selector: { matchLabels: appLabels },
    replicas: 1,
    template: {
      metadata: { labels: appLabels },
      spec: {
        containers: [{
          name: "hello-pulumi",
          image: `gcr.io/cloud-armory/hello-pulumi:${config.require('tag')}`,
        }]
      }
    }
  }
});
