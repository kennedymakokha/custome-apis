exports.mailOptionsHelper = (data) => {
    const mailOptionsObj = {
        from: `${data.address}<bradcoupers@gmail.com>`,
        to: `katchibo2@gmail.com`,
        subject: data.subject,
        template: data.template,
        context: data.context

    };
    return mailOptionsObj
}