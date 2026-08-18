{{- define "my-notes.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "my-notes.labels" -}}
helm.sh/chart: {{ include "my-notes.name" . }}-{{ .Chart.Version }}
{{ include "my-notes.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "my-notes.selectorLabels" -}}
app.kubernetes.io/name: {{ include "my-notes.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}