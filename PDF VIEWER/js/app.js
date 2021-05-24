
const url = '../documents/pdf.pdf';

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageIsPending = null;

    const scale = 1.7,
    canvas = document.getElementById('pdf-render'),
    context = canvas.getContext('2d');

    // Rendering of page
    const renderPage = num =>{
        pageIsRendering = true;

        // Get page
        pdfDoc.getPage(num).then(page =>{
            const viewport = page.getViewport({ scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            const renderContext = {
                canvasContext : context,
                viewport
            };

            page.render(renderContext).promise.then(() => {
                pageIsRendering = false;
                
                if (pageIsPending !== null) {
                    renderPage(pageIsPending);
                    pageIsPending = null;
                }
            });

            // Output current page
            document.getElementById('page-num').textContent = num;
        
        });
    };

    // Check for page rendering
    const queueRenderPage = num => {
        if (pageIsRendering) {
        pageIsPending = num;
        } else {
        renderPage(num);
        }
    };

    pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
        pdfDoc = pdfDoc_;
    
        document.getElementById('page-count').textContent = pdfDoc.numPages;
    
        renderPage(pageNum);
      })
      .catch(err => {
        // Display error
        const div = document.createElement('div');
        div.className = 'error';
        div.appendChild(document.createTextNode(err.message));
        document.querySelector('body').insertBefore(div, canvas);

        // Remove top bar
        document.getElementsByClassName('.top-bar').style.display = 'none';
      });
    
    // Show Prev Page
    const showPrevPage = () => {
      if (pageNum <= 1) {
        return;
      }
      pageNum--;
      queueRenderPage(pageNum);
    };
    

    // Show Next Page
    const showNextPage = () => {
      if (pageNum >= pdfDoc.numPages) {
        return;
      }
      pageNum++;
      queueRenderPage(pageNum);
    };


    // Button Events
    document.getElementById('prev-page').addEventListener('click', showPrevPage);
    document.getElementById('next-page').addEventListener('click', showNextPage);







// const url = '../documents/RESUME.pdf';

// let pdfDoc = null,
//   pageNum = 1,
//   pageIsRendering = false,
//   pageNumIsPending = null;

// const scale = 1.5,
//   canvas = document.querySelector('#pdf-render'),
//   ctx = canvas.getContext('2d');

// // Render the page
// const renderPage = num => {
//   pageIsRendering = true;

//   // Get page
//   pdfDoc.getPage(num).then(page => {
//     // Set scale
//     const viewport = page.getViewport({ scale });
//     canvas.height = viewport.height;
//     canvas.width = viewport.width;

//     const renderCtx = {
//       canvasContext: ctx,
//       viewport
//     };

//     page.render(renderCtx).promise.then(() => {
//       pageIsRendering = false;

//       if (pageNumIsPending !== null) {
//         renderPage(pageNumIsPending);
//         pageNumIsPending = null;
//       }
//     });

//     // Output current page
//     document.querySelector('#page-num').textContent = num;
//   });
// };

// // Check for pages rendering
// const queueRenderPage = num => {
//   if (pageIsRendering) {
//     pageNumIsPending = num;
//   } else {
//     renderPage(num);
//   }
// };

// // Show Prev Page
// const showPrevPage = () => {
//   if (pageNum <= 1) {
//     return;
//   }
//   pageNum--;
//   queueRenderPage(pageNum);
// };

// // Show Next Page
// const showNextPage = () => {
//   if (pageNum >= pdfDoc.numPages) {
//     return;
//   }
//   pageNum++;
//   queueRenderPage(pageNum);
// };

// // Get Document
// pdfjsLib
//   .getDocument(url)
//   .promise.then(pdfDoc_ => {
//     pdfDoc = pdfDoc_;

//     document.querySelector('#page-count').textContent = pdfDoc.numPages;

//     renderPage(pageNum);
//   })
//   .catch(err => {
//     // Display error
//     const div = document.createElement('div');
//     div.className = 'error';
//     div.appendChild(document.createTextNode(err.message));
//     document.querySelector('body').insertBefore(div, canvas);
//     // Remove top bar
//     document.querySelector('.top-bar').style.display = 'none';
//   });

// // Button Events
// document.querySelector('#prev-page').addEventListener('click', showPrevPage);
// document.querySelector('#next-page').addEventListener('click', showNextPage);