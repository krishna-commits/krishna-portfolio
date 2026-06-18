import fs from "fs"

const src = fs.readFileSync("config/site.tsx", "utf8")
const block = src.match(/technology_stack:\s*\[([\s\S]*?)\n  \]/)[1]
const entries = [...block.matchAll(/\{\s*name:\s*['"]([^'"]+)['"],\s*imageUrl:\s*['"]([^'"]+)['"],?\s*\}/g)].map((m) => ({
	name: m[1],
	imageUrl: m[2],
}))

const nameCounts = {}
for (const e of entries) nameCounts[e.name] = (nameCounts[e.name] || 0) + 1
const dupNames = Object.entries(nameCounts).filter(([, c]) => c > 1)

const imgGroups = {}
for (const e of entries) {
	if (!imgGroups[e.imageUrl]) imgGroups[e.imageUrl] = []
	imgGroups[e.imageUrl].push(e.name)
}
const sharedImgs = Object.entries(imgGroups)
	.filter(([, v]) => v.length > 1)
	.sort((a, b) => b[1].length - a[1].length)

const categories = [
	{ name: "Scripting", keywords: ["Python", "Bash"] },
	{ name: "Version Control", keywords: ["Git"] },
	{
		name: "Containerization and Orchestration",
		keywords: ["Docker", "Kubernetes", "Helm Chart", "AWS ECS", "Azure Container Apps"],
	},
	{
		name: "Cloud Platforms",
		keywords: ["Amazon Web Services", "Azure Services", "Google Cloud Platform", "Heroku"],
	},
	{ name: "Database Management", keywords: ["MySQL", "PostgreSQL", "MongoDB", "DynamoDB", "Dynamo DB", "RDS"] },
	{
		name: "Security Tools and Practices",
		keywords: ["Sonarcloud", "Sonarqube", "1Password", "Vault", "Cloudflare"],
	},
	{
		name: "Ci/Cd Code Repository",
		keywords: [
			"GitHub Actions",
			"Jenkins",
			"Gitlab pipelines",
			"Bitbucket Pipelines",
			"AWS CodeBuild",
			"AWS Codepipeline",
		],
	},
	{ name: "Infranstracture as Code (IAC)", keywords: ["Terraform", "Terragrunt", "Cloudformation"] },
	{
		name: "Logging and Monitoring",
		keywords: [
			"Elastic Search",
			"Fluentd/Fluentbit",
			"Kibana",
			"Prometheus",
			"Grafana",
			"AlertManager",
			"Cloudwatch",
			"Loki stack",
		],
	},
	{
		name: "Serverless",
		keywords: ["AWS Lambda", "Eventbridge", "Dynamodb streams", "AWS Step Functions", "AWS SNS"],
	},
	{ name: "Networking", keywords: ["Loadbalancer", "firewalls", "WAF"] },
	{
		name: "Communication",
		keywords: ["Slack", "Confluence", "jira", "Teams", "Zoom", "Twilio", "Sendgrid"],
	},
	{ name: "Message Queqe", keywords: ["Kafka", "RabbitMQ", "Redis", "AWS SQS"] },
	{ name: "Software Development Methodologies", keywords: ["Scrum", "Kanban", "Agile"] },
]

function categorizeOld(skillName) {
	const lowerName = skillName.toLowerCase()
	for (const category of categories) {
		if (category.keywords.some((k) => lowerName.includes(k.toLowerCase()))) return category.name
	}
	return "Other"
}

function categorizeFixed(skillName) {
	const lowerName = skillName.toLowerCase().trim()
	for (const category of categories) {
		if (category.keywords.some((k) => lowerName === k.toLowerCase())) return category.name
	}
	const all = categories.flatMap((c) => c.keywords.map((k) => ({ k, c: c.name })))
	all.sort((a, b) => b.k.length - a.k.length)
	for (const { k, c } of all) {
		if (lowerName.includes(k.toLowerCase())) return c
	}
	return "Other"
}

console.log("Total skills:", entries.length)
console.log("Duplicate names:", dupNames.length ? dupNames : "none")
console.log("\nShared images:")
for (const [img, list] of sharedImgs) {
	console.log(`  ${img} (${list.length}): ${list.join(", ")}`)
}

const miscat = entries.filter((e) => categorizeOld(e.name) !== categorizeFixed(e.name))
console.log("\nMiscategorized with old logic:", miscat.length)
for (const e of miscat) {
	console.log(`  ${e.name}: ${categorizeOld(e.name)} -> ${categorizeFixed(e.name)}`)
}

const other = entries.filter((e) => categorizeFixed(e.name) === "Other")
console.log("\nUncategorized:", other.length ? other.map((e) => e.name).join(", ") : "none")
